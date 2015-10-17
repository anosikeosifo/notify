json.array!(@notifications) do |notification|
  json.extract! notification, :id, :title, :body, :link, :image_url
  json.url notification_url(notification, format: :json)
end
