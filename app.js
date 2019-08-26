const express = require('express');
const app = express();
var redis = require('redis');
var client = redis.createClient();
