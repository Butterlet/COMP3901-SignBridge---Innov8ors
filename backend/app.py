from __init__ import create_app

app = create_app()


if __name__ == "__main__":
    # Start the development server directly. Using Supabase for persistence,
    # so no local DB initialization is necessary here.
    app.run(debug=app.config.get('DEBUG', True))
