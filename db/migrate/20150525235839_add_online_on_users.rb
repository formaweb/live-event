class AddOnlineOnUsers < ActiveRecord::Migration
  def up
    add_column :users, :online, :boolean, default: false
  end

  def down
    remove_column :users, :online
  end
end