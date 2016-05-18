class CreateEvents < ActiveRecord::Migration
  def migrate(direction)
    super
    # Create a default user
    Event.create!(status: true, name: 'Google I/O', video_url: 'https://www.youtube.com/watch?v=HDAtJxATn6M') if direction == :up
  end

  def change
    create_table :events do |t|
      t.boolean :status
      t.string :name
      t.string :video_url

      t.timestamps null: false
    end
  end
end
