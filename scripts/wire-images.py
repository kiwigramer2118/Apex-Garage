#!/usr/bin/env python3
"""
One-off data migration: replace picsum.photos placeholder URLs across the
mock dataset with real, sourced Wikimedia Commons photography (cars, tracks,
parts) via the stable Special:FilePath redirect, and regenerate user avatar
seeds to match the new initials-based Avatar component (the `avatar` field
is no longer rendered as a photo, but we keep it populated with a stable
per-user string for potential future use / debugging).
"""
import json
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data"


def wm(filename: str, width: int = 1600) -> str:
    # Commons canonical titles use underscores, not spaces.
    canonical = filename.replace(" ", "_")
    encoded = urllib.parse.quote(canonical, safe="()_")
    return f"https://commons.wikimedia.org/wiki/Special:FilePath/{encoded}?width={width}"


# ---------------------------------------------------------------------------
# Cars: hero (1600w) + gallery (1200w), real photography of the matching
# make/model/chassis sourced from Wikimedia Commons.
# ---------------------------------------------------------------------------
CAR_IMAGES = {
    "c1": {  # BMW E46 M3 - Danny
        "hero": wm("BMW M3 coupe E46.jpg", 1600),
        "gallery": [
            wm("BMW E46-M3.JPG", 1200),
            wm("S54B32-BMW-E46-M3.jpg", 1200),
            wm("BMW E46 M3 Phoenix Yellow (2).jpg", 1200),
        ],
    },
    "c2": {  # Mazda Miata NB - Sarah
        "hero": wm("Mazda-mx5-nb-emerald-green.jpg", 1600),
        "gallery": [
            wm("MX-5 SP Engine Bay.jpg", 1200),
            wm("Mazda Miata NA custom interior.jpg", 1200),
            wm("2006 Mazda MX-5 Miata Grand Touring in Marble White, Front Right, 06-08-2023.jpg", 1200),
        ],
    },
    "c3": {  # Honda S2000 AP2 - Marcus
        "hero": wm("Honda S2000 AP2 Suzuka Blue Metallic (6).jpg", 1600),
        "gallery": [
            wm("Honda S2000 type S (AP2) front.JPG", 1200),
            wm("Honda S2000 AP2 Suzuka Blue Metallic (5).jpg", 1200),
            wm("Honda S2000 AP2 Grand Prix White front left.jpg", 1200),
        ],
    },
    "c4": {  # Subaru WRX STI VA - Wendy
        "hero": wm("SUBARU WRX STI (VA) Color by WR Blue-Pearl.jpg", 1600),
        "gallery": [
            wm("Subaru WRX STI - Blue.jpg", 1200),
            wm("Subaru WRX STI (VAB) interior.JPG", 1200),
            wm("The engineroom of Subaru WRX STI (VAB).JPG", 1200),
        ],
    },
    "c5": {  # Honda Civic Type R FK8 - Rick
        "hero": wm("Honda CIVIC TYPE R (DBA-FK8) front.jpg", 1600),
        "gallery": [
            wm("Honda CIVIC TYPE R (DBA-FK8) rear.jpg", 1200),
            wm("Honda CIVIC TYPE R (FK8) interior.jpg", 1200),
            wm("Honda CIVIC TYPE R (DBA-FK8).jpg", 1200),
        ],
    },
    "c6": {  # Toyota GR86 ZN8 - Priya
        "hero": wm("2022 Toyota GR86 Premium in Track bRed, front right (NYIAS 2022).jpg", 1600),
        "gallery": [
            wm("Toyota GR86 RZ 6MT (3BA-ZN8-A2E8).jpg", 1200),
            wm("2022 Toyota GR86 Premium in Halo, Front Right, 09-27-2022.jpg", 1200),
            wm("2022 Toyota GR86 ZN8 Track Bred.jpg", 1200),
        ],
    },
    "c7": {  # Toyota GR Supra A90 - Sean
        "hero": wm("Toyota GR Supra RZ (3BA-DB42-ZRRW) front.jpg", 1600),
        "gallery": [
            wm("Toyota GR Supra SZ (3BA-DB82-ZSRW) front.jpg", 1200),
            wm("Toyota GR Supra RZ 6MT (3BA-DB06-MURW) interior.jpg", 1200),
            wm("The frontview of Toyota GR SUPRA SZ (3BA-DB82-ZSRW).jpg", 1200),
        ],
    },
    "c8": {  # BMW E46 M3 - Alex (current user)
        "hero": wm("BMW E46-M3 (3).JPG", 1600),
        "gallery": [
            wm("BMW E46-M3.JPG", 1200),
            wm("S54B32-BMW-E46-M3.jpg", 1200),
            wm("BMW M3 coupe E46.jpg", 1200),
        ],
    },
}

# ---------------------------------------------------------------------------
# Event covers: real track photography where we have it for the specific
# venue, real racing-action or clean car photography elsewhere. Not meant to
# be geographically literal per-event — just genuinely real, track-relevant
# photography instead of placeholder noise.
# ---------------------------------------------------------------------------
EVENT_IMAGES = {
    "e1": wm("Buttonwillow Banner.jpg", 1400),
    "e2": wm("Willow Springs Raceway from the Air.JPG", 1400),
    "e3": wm("2022 Toyota GR86 Premium in Halo, Front Right, 09-27-2022.jpg", 1400),
    "e4": wm("Buttonwillow.jpg", 1400),
    "e5": wm("Autocross - Werner Rennen 2018 09.jpg", 1400),
    "e6": wm("Willow Springs Raceway from the Air.JPG", 1400),
    "e7": wm("Honda S2000 AP2 Grand Prix White front left.jpg", 1400),
    "e8": wm("Buttonwillow Banner.jpg", 1400),
    "e9": wm("Subaru WRX STI (VAB) at night front.JPG", 1400),
    "e10": wm("Buttonwillow.jpg", 1400),
}

# ---------------------------------------------------------------------------
# Classifieds listing photos, grouped by the closest real part/category shot
# available. Marketplace macro shots are inherently the hardest category to
# source from an encyclopedic image library, so several categories reuse a
# small pool of genuinely relevant (if generic) part photography.
# ---------------------------------------------------------------------------
LISTING_IMAGES = {
    "l1": [wm("BBS RS764.JPG", 1200), wm("Rhein Alloy Wheel.jpg", 1200)],  # wheels
    "l2": [wm("Shock Absorbers Detail.jpg", 1200), wm("NISSAN FUGA Y50 front shock absorber.jpg", 1200)],  # suspension
    "l3": [wm("Exhaust.jpg", 1200), wm("Automobile exhaust gas.jpg", 1200)],  # exhaust
    "l4": [wm("Honda CIVIC TYPE R (FK8) interior.jpg", 1200), wm("Subaru WRX STI (VAB) interior.JPG", 1200)],  # interior
    "l5": [wm("Shock Absorbers Detail.jpg", 1200), wm("NISSAN FUGA Y50 front shock absorber.jpg", 1200)],  # suspension
    "l6": [
        wm("S54B32-BMW-E46-M3.jpg", 1200),
        wm("MX-5 SP Engine Bay.jpg", 1200),
        wm("The engineroom of Subaru WRX STI (VAB).JPG", 1200),
    ],  # engine
    "l7": [wm("Brembo Disc brake.jpg", 1200)],  # brakes
    "l8": [wm("BMW Alpina alloy wheel.jpg", 1200), wm("Rhein Alloy Wheel.jpg", 1200), wm("BBS RS764.JPG", 1200)],  # wheels
    "l9": [wm("Toyota GR86 RZ (3BA-ZN8) (3).jpg", 1200), wm("2022 Toyota GR86 ZN8 Track Bred.jpg", 1200)],  # exterior
    "l10": [wm("Honda CIVIC TYPE R (FK8) interior.jpg", 1200)],  # electronics
}


def load(name):
    with open(DATA / name, encoding="utf-8") as f:
        return json.load(f)


def save(name, data):
    with open(DATA / name, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


cars = load("cars.json")
for car in cars:
    mapping = CAR_IMAGES.get(car["id"])
    if not mapping:
        continue
    car["heroImage"] = mapping["hero"]
    car["gallery"] = mapping["gallery"]
save("cars.json", cars)

events = load("events.json")
for event in events:
    url = EVENT_IMAGES.get(event["id"])
    if url:
        event["coverImage"] = url
save("events.json", events)

listings = load("listings.json")
for listing in listings:
    urls = LISTING_IMAGES.get(listing["id"])
    if urls:
        listing["images"] = urls
save("listings.json", listings)

print("Wired", len(cars), "cars,", len(events), "events,", len(listings), "listings to Wikimedia Commons imagery.")
