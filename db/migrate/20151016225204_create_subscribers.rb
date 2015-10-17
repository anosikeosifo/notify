class CreateSubscribers < ActiveRecord::Migration
  def change
    create_table :subscribers do |t|
      t.text :registration_id

      t.timestamps null: false
    end
  end
end
