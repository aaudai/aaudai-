#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
import sys

def capture_screenshot(url, output_path):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})
        page.goto(url)
        # Wait for page to load
        page.wait_for_load_state('networkidle')
        # Take full page screenshot
        page.screenshot(path=output_path, full_page=True)
        browser.close()
        print(f"Screenshot saved to {output_path}")

if __name__ == "__main__":
    url = "http://localhost:8000/"
    output = "/home/user/aaudai-/website-screenshot.png"
    capture_screenshot(url, output)
