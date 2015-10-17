class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.string :title
      t.string :body
      t.string :link
      t.attachment :image
      t.string :image_url

      t.timestamps null: false
    end
  end
end
