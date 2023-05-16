import requests
import json
import os

# set up your Parse API credentials and headers
url = 'https://parseapi.back4app.com/classes/UserToken'
headers = {
    'X-Parse-Application-Id': 'KLxcuhhjrb2JQwegqs5jto882HLxv7scW89HDACX',
    'X-Parse-REST-API-Key': 'fUH4PcMVM4LXwMLIrQMQSIrEeHD9gRSQCzKVIq1G'
}

# make the GET request and parse the response
response = requests.get(url, headers=headers)
if response.status_code == 200:
    data = json.loads(response.content)
    tokens = []
    for user in data['results']:
        tokens.append(user['expoPushToken'])

    print(tokens)

else:
    print('Error:', response)

push_data = {
    "to": tokens,
    "title": "Hi there!",
    "body": "Spotting some new Danish words around you? 🇩🇰 Take a picture!"
}

curl_data = {
    "url": "https://exp.host/--/api/v2/push/send",
    "header": "Content-Type: application/json",
    "data": json.dumps(push_data)
}

curl_command = 'curl -H "{header}" -X POST "{url}" -d \'{data}\''.format(**curl_data)

response = os.system(curl_command)
