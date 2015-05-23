class AddCanEditEventOnUsers < ActiveRecord::Migration
  def up
    add_column :users, :can_edit_event, :boolean, default: true
  end

  def down
    remove_column :users, :can_edit_event
  end
end