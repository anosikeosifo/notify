require 'net/http'
require 'net/https'

class GcmPush
  GCM_URL = "https://android.googleapis.com/gcm/send"
  GCM_KEY = Rails.application.secrets.gcm_api_key

  def self.send(registration_ids)
      uri = URI.parse(GCM_URL)
      uri.query = URI.encode_www_form(registration_ids)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request = Net::HTTP::Post.new(uri.request_uri)
      request['Authorization'] = "key=#{ GCM_KEY }"
      request["Content-Type"] = "application/json"
      http.request(request).body
  end
end
