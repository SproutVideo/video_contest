class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.references :submission
      t.string :ip_address
      t.string :user_agent
      t.timestamps
    end
  end
end
