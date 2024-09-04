from model import get_response
from translate import vi_en, en_vi

def get_user_input():
    user_input = input("Nhập mô tả triệu chứng của bạn: ")
    return user_input
    
user_input = get_user_input()

## user_input = "Tôi cảm thấy khớp gối của tôi bị đau nhứt"

response = get_response(vi_en(user_input))
print(en_vi(response))
