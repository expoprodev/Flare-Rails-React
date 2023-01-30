# frozen_string_literal: true

class Device < ApplicationRecord
  validates_uniqueness_of :uuid
  belongs_to :user

  def notify_machine_down(code)
    if platform == "iOS"
      apn = Houston::Client.production

      # Create a notification that alerts a message to the user, plays a sound, and sets the badge on the app
      notification = Houston::Notification.new(device: token)
      notification.alert =
        " Issue reported for #{code.label} at #{code.location.name}."

      # Notifications can also change the badge count, have a custom sound, have a category identifier, indicate available Newsstand content, or pass along arbitrary data.
      notification.badge = user.company.codes.down.count
      # notification.sound = 'sosumi.aiff'
      notification.category = "INVITE_CATEGORY"
      notification.content_available = true
      notification.mutable_content = true
      apn.push(notification)
    end

    if platform == "Android"
      fcm = FCM.new(ENV["FIREBASE_KEY"])

      registration_ids = [token]
      options = {
        notification: {
          title: "Issue reported.",
          text: " Issue reported for #{code.label} at #{code.location.name}."
        },
        priority: "high"
      }
      response = fcm.send(registration_ids, options)
    end
  end

  def notify_message(from, body)
    if platform == "iOS"
      apn = Houston::Client.production

      # Create a notification that alerts a message to the user, plays a sound, and sets the badge on the app
      notification = Houston::Notification.new(device: token)
      notification.alert = "MSG: From #{from} - #{body}."

      # Notifications can also change the badge count, have a custom sound, have a category identifier, indicate available Newsstand content, or pass along arbitrary data.
      notification.badge = user.company.codes.down.count
      # notification.sound = 'sosumi.aiff'
      notification.category = "INVITE_CATEGORY"
      notification.content_available = true
      notification.mutable_content = true
      apn.push(notification)
    end

    if platform == "Android"
      fcm = FCM.new(ENV["FIREBASE_KEY"])

      registration_ids = [token]
      options = {
        notification: { title: " MSG: From #{from}", text: " #{body}" },
        priority: "high"
      }
      response = fcm.send(registration_ids, options)
    end
  end

  def notify_default_code(default_code_id, location)
    default_code = DefaultCode.find(default_code_id)

    if platform == "iOS"
      apn = Houston::Client.production

      # Create a notification that alerts a message to the user, plays a sound, and sets the badge on the app
      notification = Houston::Notification.new(device: token)
      notification.alert = "#{default_code.name} reported at #{location.name}"

      # Notifications can also change the badge count, have a custom sound, have a category identifier, indicate available Newsstand content, or pass along arbitrary data.
      notification.badge = user.company.codes.down.count
      # notification.sound = 'sosumi.aiff'
      notification.category = "INVITE_CATEGORY"
      notification.content_available = true
      notification.mutable_content = true
      apn.push(notification)
    end

    if platform == "Android"
      fcm = FCM.new(ENV["FIREBASE_KEY"])

      registration_ids = [token]
      options = {
        notification: {
          title: "Issue reported.",
          text: " #{default_code.name} reported at #{location.name}"
        },
        priority: "high"
      }
      response = fcm.send(registration_ids, options)
    end
  end
end
