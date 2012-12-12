class AddShortUrlToSubmissions < ActiveRecord::Migration
  def change
    add_column :submissions, :short_url, :string
  end
end
