json.array! @numbers do |number|
  json.friendly_name number.friendly_name
  json.phone_number number.phone_number
end
