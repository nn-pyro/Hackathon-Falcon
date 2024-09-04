import sys
import io
from deep_translator import GoogleTranslator

def vi_en(user_input):
    en = GoogleTranslator(source='auto', target='en').translate(user_input)
    return en

def en_vi(user_input):
    vi = GoogleTranslator(source='auto', target='vi').translate(user_input)
    return vi

if __name__ == "__main__":
    # Đảm bảo sử dụng UTF-8 cho đầu ra
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    if len(sys.argv) < 3:
        print("Usage: python translate.py <text> <direction>")
        sys.exit(1)

    user_input = sys.argv[1]
    direction = sys.argv[2]
    if direction == 'vi_en':
        print(vi_en(user_input))
    elif direction == 'en_vi':
        print(en_vi(user_input)
              )
    else:
        print(user_input)
