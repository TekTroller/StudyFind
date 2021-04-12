from fastapi import FastAPI
from random import randint
from os import system
from pydantic import BaseModel
from EmailSender import EmailServer

app = FastAPI()
email_server = EmailServer()
email_code_db = {}

class UserEmail(BaseModel):
    email: str

@app.post('/verification/{email}')
def verification(user_email: UserEmail):
    code = randint(100000,999999)
    message = 'Your verification code is: ' + str(code)
    message += """\n\nPLEASE DO NOT REPLY TO THIS EMAIL.\n\n
    This message (including any attachments) contains confidential information intended for 
    a specific individual and purpose, and its content is protected by law. If you are not 
    the intended recipient, you should delete this message and are hereby notified that any 
    disclosure, copying or distribution of this transmission, or taking any action based on 
    it, is strictly prohibited."""

    #Use email server to send code to the email address
    email_server.send_code(user_email.email, code, message)

    #Add the email-code pair to a dictionary
    email_code_db[data.email] = code

    #Schedule a function to delete this email-code pair after a certain time (i.e. 60 seconds)
    #To be implemented

    return {'data':{'mail':user_email.email, 'code': code, 'email_code_db': email_code_db}}

if __name__ == '__main__':
    system("uvicorn App:app --reload")