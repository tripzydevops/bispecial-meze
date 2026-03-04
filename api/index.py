import sys
import os

# Add the project root to sys.path so we can import 'backend'
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root not in sys.path:
    sys.path.insert(0, root)

from backend.app.main import handler

# Vercel's Python runtime searches for 'app' or 'application'
app = handler
