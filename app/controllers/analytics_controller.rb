# frozen_string_literal: true

class AnalyticsController < ApplicationController
  authorize_resource class: false
  # GET /analytics
  # GET /analytics.json
  def index
    @percent_status = current_user.default_location.codes.group(:status).count
    @incidents =
      current_user.default_location.codes.includes(:incidents).sort_by do |c|
        -c.incidents.count
      end.reject { |c| c.incidents.to_a.empty? }.map do |c|
        { key: c.label, y: c.incidents.to_a.size }
      end

    @avg_fixed_hour =
      current_user.default_location.incidents.select(
        "date_trunc('hour', fixed_at)",
        :fixed_by,
        :code_id
      ).group(:fixed_at, :fixed_by, :code_id).count(:code_id)

    @top_incident_by_tag =
      current_user.default_location.incidents.where(status: Code::DOWN)
                  .map { |i| i.code.tag_counts_on(:tags) if i.code }.map do |tag|
        tag.map { |t| { t.name => t.taggings_count } } if tag
      end.flatten.compact.inject do |a, b|
        a.merge(b) { |_, x, y| x + y }
      end&.map { |k, v| { key: k, y: v } }

    @distribution_by_tag =
      current_user.default_location.codes.map do |c|
        c.tag_counts_on(:tags)
      end.map do |tag|
        tag.map { |t| { t.name => t.taggings_count } } if tag
      end.flatten.compact.inject do |a, b|
        a.merge(b) { |_, x, y| x + y }
      end&.map { |k, v| { key: k, y: v } }

    @incident_count_by_month =
      current_user.default_location.incidents.group_by do |t|
        t.created_at.beginning_of_month
      end.sort.map { |s, i| { x: s.to_i * 1000, y: i.count } }.to_json.html_safe
    @down_count_by_hour =
      current_user.default_location.incidents.open.group_by do |t|
        t.created_at.hour
      end.sort.map { |s, i| { x: s.to_i, y: i.count } }.to_json.html_safe
    @up_count_by_hour =
      current_user.default_location.incidents.closed.group_by do |t|
        t.created_at.hour
      end.sort.map { |s, i| { x: s.to_i, y: i.count } }.to_json.html_safe
  end
end
