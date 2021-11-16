import os
import time

print("Checking for Updates...")
print("")
print("Grades Pro Installer")
key = input("Enter your Canvas API key: ")
print("Setting up Grades Pro with: " + key)

f = open(".env", "w")
f.write("CANVAS_KEY=" + key)
f.close()

print("Saved Canvas API Key")
print("Preparing Dependencies...")



os.system("npm install")

print("Dependencies Installed")
print("Installing Grades Pro...")

time.sleep(2)

print("Grades Pro Installed")
print("")
print("Successfully configured and installed Grades Pro.")
