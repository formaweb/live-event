class AddSuperUserOnUsers < ActiveRecord::Migration
  def up
    add_column :users, :super_user, :boolean, default: true
    remove_column :users, :can_edit_event
  end

  def down
    remove_column :users, :super_user
    add_column :users, :can_edit_event, :boolean, default: true
  end
end