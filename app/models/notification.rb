class Notification < ActiveRecord::Base
  attr_accessor :url_host
  after_create :update_image_url

  has_attached_file :image, styles: { medium: "400x350>", thumb: "100x100>" }, default_url: "/images/default.png"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  def update_image_url
    self.image_url = "#{ url_host}#{ image.url(:medium) }"
    self.save
  end
end
