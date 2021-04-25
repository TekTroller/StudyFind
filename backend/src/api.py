from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from random import randint
from EmailSender import EmailServer
import time
import threading

from typing import List, Optional
from  model import Item, RequestCodeData, VerificationData

def create_application() -> FastAPI:
    app = FastAPI()
    email_server = EmailServer()
    email_code_map = {}
    fake_password_db = {}

    origins = [
        # This is the frontend port - 19002
        "http://localhost:19002/",
        "localhost:19002"
    ]

    # Allow communication between backend and frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )

    @app.get("/")
    async def main():
        print('hello')
        return {"message": "Hello World"}

    # send verification code
    @app.post('/send_code/')
    async def request_code(data: RequestCodeData):
        if data.email in fake_password_db:
            return {'Email already registered'}

        code = randint(100000,999999)
        message = 'Your verification code is: ' + str(code)
        message += """\n\nPLEASE DO NOT REPLY TO THIS EMAIL.\n\n
        This message (including any attachments) contains confidential information intended for 
        a specific individual and purpose, and its content is protected by law. If you are not 
        the intended recipient, you should delete this message and are hereby notified that any 
        disclosure, copying or distribution of this transmission, or taking any action based on 
        it, is strictly prohibited."""

        #Use email server to send code to the email address
        email_server.send_code(data.email, code, message)

        #Add the email-code pair to a dictionary
        email_code_map[data.email] = code

        #Schedule a function to delete this email-code pair after a certain time (i.e. 60 seconds)
        #To be implemented
        print(data.email)
        auto_delete_thread = threading.Thread(target=scheduledelete, args=(data.email,))
        auto_delete_thread.start()
        
        return {'data':{'mail':data.email, 'code': code, 'email_code_map': email_code_map}}

    @app.post('/verification/')
    async def verification(data: VerificationData):
        if data.email not in email_code_map.keys():
            return {'Email not found'}
        
        if data.code == email_code_map[data.email]:
            fake_password_db[data.email] = data.password
            return {'data':{'fake_password_db': fake_password_db}}
        else:
            return {'Wrong code'}

    def scheduledelete(email:str):
        time.sleep(5)
        email_code_map.pop(email, None)
        print("Email deleted: " + email)

    return app

app = create_application()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)