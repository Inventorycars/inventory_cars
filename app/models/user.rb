class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  has_many :inventories

  before_create :set_homenet_email, if: -> { email.present? }

  scope :unconfirmed, -> { where(confirmed_at: nil)}
  scope :confirmed, -> { where.not(confirmed_at: nil) }


  def set_homenet_email
    self.homenet_email = self.email
  end
end
