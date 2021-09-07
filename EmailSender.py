import smtplib
from email.message import EmailMessage

class EmailServer():
    def __init__(self):
        self.server = smtplib.SMTP('smtp.gmail.com', 587)
        self.server.ehlo()
        self.server.starttls()

        self.email = 'studyfindtesting@gmail.com'
        self.password = 'main(args[])'
        
        self.log_in()

    def send_code(self, user_email, code, message):
        msg = EmailMessage()
        msg['Subject'] = 'StudyFind Medical Database Registration'
        msg['From'] = self.email
        msg['To'] = user_email
        msg.set_content(message)
        
        self.server.send_message(msg)

    def log_in(self):
        self.server.ehlo()
        self.server.login(self.email, self.password)

'''
if __name__ == '__main__':
    server = EmailServer()
    server.send_code('jlu628@gatech.edu',123456)
'''
