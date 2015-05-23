class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.integer :event_id
      t.integer :user_id
      t.text :message

      t.timestamps null: false
    end
  end
end
