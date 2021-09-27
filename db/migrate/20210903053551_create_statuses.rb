class CreateStatuses < ActiveRecord::Migration[5.2]
  def change
    create_table :statuses do |s|
      s.string :display_order
      s.string :status
      s.string :status_color
      s.timestamps
    end
  end
end
