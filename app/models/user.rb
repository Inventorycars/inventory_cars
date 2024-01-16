class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable#, :confirmable
  paginates_per 10
  has_many :inventories

  validates :first_name, :last_name, :phone_number, :city, presence: true

  before_create :set_homenet_email, if: -> { email.present? }
  before_validation :valid_password, if: :new_record?
  after_create :send_welcome_mail

  scope :unconfirmed, -> { where(confirmed_at: nil) }
  scope :confirmed, -> { where.not(confirmed_at: nil) }

  def valid_password
    token = Devise.friendly_token
    self.password = token
    self.password_confirmation = token
  end

  def send_welcome_mail
    UserMailer.welcome_user(self).deliver_now
    UserMailer.dealer_added(self).deliver_now
  end

  def set_homenet_email
    self.homenet_email = self.email
  end
end
