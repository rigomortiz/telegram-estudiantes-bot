from telethon import TelegramClient, events, sync, functions
from telethon.tl.functions.messages import GetDialogsRequest
from telethon.tl.types import InputPeerEmpty


def get_members(group_id):
    client = TelegramClient('telebot', API_ID, API_HASH).start()
    participants = client.get_participants(group_id)
    for x in participants:
        print(f'{x.id}, {x.first_name}, {x.last_name}, {x.username}, {x.phone}')

if __name__ == '__main__':
    get_members(CHAT_ID)
