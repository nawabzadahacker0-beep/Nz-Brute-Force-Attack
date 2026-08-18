#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
make-passwords.py — Brute Force Tool ke liye 4000+ passwords ki list banata hai.
Run:  python3 make-passwords.py
Output: passwords/basic-4000.txt
"""
import os

WORDS = """admin password 123456 qwerty letmein welcome monkey dragon master hello sunshine princess football superman iloveyou batman trustno1 shadow charlie michael jordan hunter ranger soccer hockey starwars naruto goku akatsuki sharingan pakistan india bangladesh srilanka turkey dubai karachi lahore islamabad peshawar quetta multan faisalabad rawalpindi hyderabad sialkot khan ahmed ali hassan bilal umar zain sara aisha fatima nawab hacker cyber anonymous unknown ghost ninja tiger lion king queen rocket secret love angel baby money freedom cricket messi ronaldo virat bhola jani bhai bro dude cool super power dark night moon star fire water earth wind legend warrior allahuakbar ramadan eidmubarak quaid jinnah iqbal pakforce whatsapp hacking virus killer beast wolf eagle falcon phoenix demon devil babygirl forever alex sam john mike david chris james daniel robert william joseph thomas charles anthony mark steven paul andrew joshua kevin brian george edward ronald timothy jason jeffrey ryan jacob gary nicholas eric jonathan stephen larry justin scott brandon benjamin samuel frank gregory raymond alexander patrick jack dennis jerry tyler aaron henry douglas peter adam nathan zachary kyle walter harold carl jeremy keith roger gerald ethan arthur terry christian sean lawrence austin joe albert jesse willie billy bryan bruce noah dylan ralph roy alan wayne eugene logan randy louis abdullah usman hamza owais danish fahad imran kamran salman shahzad naveed asif akram arslan asad amir azhar babar dawood faisal gulzar haris hammad irfan junaid kashif khurram mazhar moiz mudassar nadeem nasir noman qasim raheel raza rehan rizwan saad sajid shoaib sohail tahir talha tariq waqar waseem yasir zeeshan zubair mariam maryam hina sana laiba nimra mehak kinza maham maliha khadija sumaira bushra nadia sadia rabia tania zainab yusra amna facebook tiktok instagram snapchat gmail google youtube twitter whatsapp netflix amazon android iphone windows linux python java login access root system forever soulmate darling sweetheart heaven hell god devil spirit soul faith warrior soldier knight samurai pirate cowboy wizard mage hunter diamond emerald ruby sapphire topaz pearl gold silver bronze platinum thunder lightning tornado hurricane cyclone typhoon blizzard avalanche earthquake volcano galaxy nebula comet meteor eclipse orbit rocket satellite astronaut captain general major admiral commander chief leader boss mentor kingdom empire republic nation tribe clan squad team crew gang victory glory honor courage bravery strength wisdom justice mercy apple banana orange mango grape cherry peach melon lemon berry panda koala dolphin penguin panther cheetah zebra giraffe elephant summer winter spring autumn rainbow flower rose lily jasmine lotus tulip orchid daisy""".split()

SUFFIXES = ['1','12','123','1234','12345','123456','1234567','12345678','786','7860','1947','2020','2021','2022','2023','2024','2025','2026','00','000','007','111','222','333','444','555','666','777','888','999','69','99','100','01','!','@','#','$','%','*','_','.','!1','@1','#1','_1','123!','123@','123#','1234!','786!','2024!','2025!']

def leet(w):
    return (w.replace('a','@').replace('e','3').replace('i','1')
             .replace('o','0').replace('s','5').replace('t','7'))

pool = set()
for w in WORDS:
    w = w.strip().lower()
    if not w: continue
    pool.add(w)
    pool.add(w.capitalize())
    pool.add(w.upper())
    pool.add(leet(w))
    for s in SUFFIXES:
        pool.add(w + s)
    pool.add(w + w)
    pool.add(w[::-1])

# pure numeric / keyboard patterns
for n in ['0','00','000','0000','00000','000000','111111','222222','333333','444444',
          '555555','666666','777777','888888','999999','123123','121212','112233',
          '123321','654321','987654','456789','147258','159753','102030','110011',
          '135790','246810','19471947','20002000','786786','12341234','43214321',
          '11111111','22222222','1234567890','0987654321','0123456789','1q2w3e4r',
          'qwertyuiop','asdfghjkl','zxcvbnm','1qaz2wsx','zaq12wsx','qazwsxedc',
          'qweasdzxc','abc123','123abc','qwe123','asd123','zxc123','abc123456']:
    pool.add(n)

# years ke sath combos
for y in ['1990','1995','2000','2001','2002','2003','2004','2005','2006','2007',
          '2008','2009','2010','2011','2012','2013','2014','2015','2016','2017',
          '2018','2019','2020','2021','2022','2023','2024','2025','2026','1947']:
    pool.add(y)
    pool.add('admin' + y)
    pool.add('pakistan' + y)

# dates
for d in ['0101','1408','2303','2512','3112','0505','0707','0909','1010','1212',
          '01012024','14082026','25122026','14081947']:
    pool.add(d)

# numeric patterns (4-digit aur 6-digit)
for i in range(0, 10000, 7):
    pool.add(str(i).zfill(4))
for i in range(0, 1000000, 911):
    pool.add(str(i).zfill(6))

# safety net: 4000 se kam kabhi nahi hoga
while len(pool) < 4000:
    pool.add('x' + str(len(pool)) + 'y')

os.makedirs('passwords', exist_ok=True)
path = os.path.join('passwords', 'basic-4000.txt')
with open(path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(sorted(pool)))
print(f'✅ Generated {len(pool)} passwords -> {path}')
