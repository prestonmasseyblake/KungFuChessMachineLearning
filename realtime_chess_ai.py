#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Feb 27 14:03:57 2023

@author: zc
@author: prestonblake
"""

import classic.chess_rt as chess
import numpy as np
import uuid
import json
import requests
import gym
import gym_chess
import random

#GLOBAL VARIABLES 
API_URL = "http://localhost:8000/upload/"
TIMER = 0
# KUNG FU FUNCTIONALITY  

#GLOBAL VARIABLES FOR DIFFERENT MODES
STANDARD_MODE = 10  
LIGHTINING_MODE = 1


# function to decrement the hash map 
def decrement_hash_map(hash_m):
    # print(hash_m)
    keys_to_delete = []
    for key in hash_m:
        hash_m[key] -= 1
        if hash_m[key] == 0:
            keys_to_delete.append(key)
    for key in keys_to_delete:
        del hash_m[key]
    print(hash_m)


#function for if a knight lands on its own piece that piece must be killed  
def same_color_knight_landing():
    print("knight")

#check which piece started moving first if there is a colisiion kill the last piece moving
def check_colision():
    print("colision")
    
# END KUNG FU FUNCTIONALITY


# API/DATABASE FUNCTIONALITY 
def post_uuid_to_api(api_url, my_uuid, time, board):
    # Serialize the UUID as a string using json.dumps()
    serialized_uuid = json.dumps(str(my_uuid))
    payload = {'uuid': serialized_uuid,'time': time,  'board': board}
    response = requests.post(api_url, json=payload)

    # Print the response
    print(response.text)

# END API/DATABASE FUNCTIONALITY 
if __name__ == "__main__":
    print("start")
    tag = uuid.uuid4()
    hash_map = {}
    print(tag)
    # create an environment
    env = chess.env('ansi')
    # reset the environment
    obs = env.reset()
    games = 1
    count_down = 400
    # added from the open ai 
    g_env = gym.make('Chess-v0')
    print("this is g env",g_env.render())
    # end of added from the open ai 
    for agent in env.agent_iter():
        print("this is the agent",agent)
        env.unwrapped.set_color(agent)
        observation, reward, termination, truncation, info = env.last()
        
        # Somehow it only terminates until the last opponent piece is captured
        if termination:
            print("Game Over")
            # Game counter
            games -= 1
            if games > 0:
                obs = env.reset()
                continue
            break
        if truncation:
            env.step(None)
            continue

        if not agent in hash_map: 
            
            valid_moves = np.where(np.array(observation["action_mask"]) == 1)[0]
            # Randomly choose a valid move as suggested from the chess python API
            move = np.random.choice(valid_moves)
            
            col = move//(8*74)
            row = (move//74)%8
            print("move index:", move)
            print("move (x = {}, y = {}, c = {})".format(col, row, move-(col*8+row)*74))
            env.step(move)
            pvs_agent = agent
            decrement_hash_map(hash_map)
            hash_map[agent] = STANDARD_MODE
        else:
            print("piece is cooling down")
            decrement_hash_map(hash_map)
            move = 0
            env.step(move)
            # action(0)
        
        print(env.render())
        print(type(env.render()))
        # comment out this line if you dont want to push to database
        # post_uuid_to_api(API_URL, tag, TIMER, env.render())
        TIMER += 1
        print()
    
        count_down -= 1
        if count_down == 0:
            break
    