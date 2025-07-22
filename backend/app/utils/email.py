import smtplib
from email.message import EmailMessage

class EmailUtil():
    @staticmethod
    def send_verification_email(to_email, code):
        msg = EmailMessage()
        msg["Subject"] = "Your Verification Code"
        msg["From"] = "youssefkhalednegm24@gmail.com"
        msg["To"] = to_email
        msg.set_content(f"Your verification code is: {code}")

        with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
            smtp.starttls()
            smtp.login("youssefkhalednegm24@gmail.com", "ryde gkdz aoyq qxug")  # Is this should be my own password?
            smtp.send_message(msg)

        # OR

        # with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        #     smtp.login("youssefkhalednegm24@gmail.com", "ryde gkdz aoyq qxug")
        #     smtp.send_message(msg)