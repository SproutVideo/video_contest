class AddCompanyNameToSubmissions < ActiveRecord::Migration
  def change
    add_column :submissions, :company_name, :string
  end
end
