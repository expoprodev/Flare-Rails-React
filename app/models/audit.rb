# frozen_string_literal: true

class Audit
  def self.to_message(audit)
    message = ""
    case audit.auditable_type
    when "Incident"
      changes = audit.audited_changes
      Rails.logger.info changes
      if audit.action == "create"
        label =
          if changes["code_id"]
            Code.find(changes["code_id"]).label
          else
            DefaultCode.find(changes["default_code_id"]).name
          end
        message =
          "Request reported by #{changes['reported_by_phone']} for #{label}."
      end

      if audit.action == "update"
        if audit.user
          message =
            "#{audit.user.display_name} updated status to #{
              Incident::STATUSES[changes['status'].last]
            } for #{audit.auditable.code.label}."
        end
      end
    end
    message
  end
end
