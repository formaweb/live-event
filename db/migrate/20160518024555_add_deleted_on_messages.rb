class AddDeletedOnMessages < ActiveRecord::Migration
  def up
    add_column :messages, :deleted, :boolean, default: false
  end

  def down
    remove_column :messages, :deleted
  end
end
