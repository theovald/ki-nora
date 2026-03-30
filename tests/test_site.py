import os
from bs4 import BeautifulSoup

def test_index_html_exists():
    assert os.path.exists("index.html"), "index.html does not exist"

def test_index_html_content():
    with open("index.html", "r", encoding="utf-8") as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, "html.parser")

    # Check title
    assert soup.title.string == "Nora Gjøen-Gjøsæter | Foredragsholder & KI-leder"

    # Check main header
    h1 = soup.find("h1")
    assert h1 is not None
    assert "Nora Gjøen-Gjøsæter" in h1.text

    # Check for dark theme default
    body = soup.find("body")
    assert "dark-theme" in body.get("class", [])

    # Check sections exist
    sections = soup.find_all("section")
    assert len(sections) >= 4  # Hero-split, Temaer, Scener, Bakgrunn, Booking

    # Check for speaker image
    img = soup.find("img", class_="hero-image")
    assert img is not None
    assert img["src"] == "speaker.jpeg"

    # Check we have 4 topic cards
    topic_cards = soup.find_all("div", class_="topic-card")
    assert len(topic_cards) >= 4

    # Check for contact form
    form = soup.find("form", id="booking-form")
    assert form is not None
    assert form["action"] == "mailto:nora@kantega.no"

    # Check CSS and JS links
    css_link = soup.find("link", href="style.css")
    assert css_link is not None

    js_script = soup.find("script", src="script.js")
    assert js_script is not None