#!/usr/bin/env python3
"""
One-off data migration for the User Profile + Garage spec: adds car status
(current/project/sold), a second (sold/historic) car for the current user so
the Garage status toggle has real content in every tab, and the new profile
fields (cover image, role, social links, communities, featured car, profile
gallery) sourced from the same Wikimedia Commons pool already wired in by
wire-images.py — reused rather than re-fetched so profile covers/galleries
stay thematically tied to each person's own car/context instead of random
stock photography.
"""
import json
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data"


def wm(filename: str, width: int = 1600) -> str:
    canonical = filename.replace(" ", "_")
    encoded = urllib.parse.quote(canonical, safe="()_")
    return f"https://commons.wikimedia.org/wiki/Special:FilePath/{encoded}?width={width}"


def load(name):
    with open(DATA / name, encoding="utf-8") as f:
        return json.load(f)


def save(name, data):
    with open(DATA / name, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


# ---------------------------------------------------------------------------
# Cars: status per existing car + one new sold/historic car for Alex (u8) —
# his pre-E46 track car, sold to help fund the M3 project. Gives the Garage
# status toggle (Actual / Proyecto / Histórico) real content across all
# three tabs instead of only ever showing "current".
# ---------------------------------------------------------------------------
CAR_STATUS = {
    "c1": "current",
    "c2": "current",
    "c3": "current",
    "c4": "project",
    "c5": "current",
    "c6": "current",
    "c7": "project",
    "c8": "project",
}

NEW_CAR_C9 = {
    "id": "c9",
    "ownerId": "u8",
    "make": "Honda",
    "model": "Civic Type R",
    "chassisCode": "EK9",
    "year": 1998,
    "nickname": "First Love",
    "heroImage": wm("1997 Honda Civic Type R EK9.jpg", 1600),
    "gallery": [
        wm("Honda Civic EK4.jpg", 1200),
        wm("EK9 Honda Civic Type R IMG 7754.jpg", 1200),
    ],
    "specs": {
        "power": "182 hp @ 8,200 rpm",
        "weight": "2,271 lb",
        "drivetrain": "FF",
        "transmission": "5-speed manual",
        "tires": "Yokohama Advan Neova AD08 205/50R15",
        "suspension": "OEM+ with Cusco sway bars",
    },
    "mods": [
        {"category": "Suspension", "items": ["Cusco front/rear sway bars", "OEM Type R springs (kept OEM+)"]},
        {"category": "Wheels & Brakes", "items": ["OEM Type R alloys, refinished", "Project Mu brake pads"]},
        {"category": "Interior", "items": ["Recaro-style OEM Type R buckets", "Momo shift knob"]},
    ],
    "bestLapTrackId": "buttonwillow",
    "bestLapTime": "2:08.410",
    "status": "sold",
}

cars = load("cars.json")
for car in cars:
    car["status"] = CAR_STATUS.get(car["id"], "current")
cars.append(NEW_CAR_C9)
save("cars.json", cars)

# ---------------------------------------------------------------------------
# Users: profile fields. Cover images and gallery images are pulled from
# each person's own already-sourced car photography (a different frame than
# their car's own heroImage) so profiles feel personal without needing a
# separate stock-photo sourcing pass.
# ---------------------------------------------------------------------------
PROFILE_FIELDS = {
    "u1": {
        "coverImage": wm("BMW E46 M3 Phoenix Yellow (2).jpg", 1600),
        "role": "Track Builder",
        "socialLinks": {"instagram": "danny.builds"},
        "communities": ["E46 Owners SoCal", "Buttonwillow Regulars"],
        "featuredCarId": "c1",
        "galleryImages": [
            wm("BMW M3 coupe E46.jpg", 1200),
            wm("S54B32-BMW-E46-M3.jpg", 1200),
            wm("Buttonwillow Banner.jpg", 1200),
        ],
    },
    "u2": {
        "coverImage": wm("2006 Mazda MX-5 Miata Grand Touring in Marble White, Front Right, 06-08-2023.jpg", 1600),
        "role": "Weekend Racer",
        "socialLinks": {"instagram": "kimchi.miata"},
        "communities": ["SoCal Miata Club", "HB Cars & Coffee"],
        "featuredCarId": "c2",
        "galleryImages": [
            wm("Mazda-mx5-nb-emerald-green.jpg", 1200),
            wm("MX-5 SP Engine Bay.jpg", 1200),
        ],
    },
    "u3": {
        "coverImage": wm("Honda S2000 AP2 Grand Prix White front left.jpg", 1600),
        "role": "Builder",
        "socialLinks": {"instagram": "s2k_marcus"},
        "communities": ["S2000 Club SoCal", "Buttonwillow Regulars"],
        "featuredCarId": "c3",
        "galleryImages": [
            wm("Honda S2000 AP2 Suzuka Blue Metallic (6).jpg", 1200),
            wm("Honda S2000 type S (AP2) front.JPG", 1200),
        ],
    },
    "u4": {
        "coverImage": wm("Subaru WRX STI - Blue.jpg", 1600),
        "role": "Autocross Regular",
        "socialLinks": {"instagram": "wrx.wendy"},
        "communities": ["SoCal Autocross", "Subaru SoCal"],
        "featuredCarId": "c4",
        "galleryImages": [
            wm("SUBARU WRX STI (VA) Color by WR Blue-Pearl.jpg", 1200),
            wm("The engineroom of Subaru WRX STI (VAB).JPG", 1200),
        ],
    },
    "u5": {
        "coverImage": wm("Honda CIVIC TYPE R (DBA-FK8) rear.jpg", 1600),
        "role": "Time Attack Curious",
        "socialLinks": {"instagram": "civic.type.rick"},
        "communities": ["Type R Owners", "Willow Springs Time Attack"],
        "featuredCarId": "c5",
        "galleryImages": [
            wm("Honda CIVIC TYPE R (DBA-FK8) front.jpg", 1200),
            wm("Honda CIVIC TYPE R (FK8) interior.jpg", 1200),
        ],
    },
    "u6": {
        "coverImage": wm("2022 Toyota GR86 Premium in Halo, Front Right, 09-27-2022.jpg", 1600),
        "role": "Photographer",
        "socialLinks": {"instagram": "grtwins", "youtube": "grtwinsphoto"},
        "communities": ["GR86/BRZ Twins", "HB Cars & Coffee"],
        "featuredCarId": "c6",
        "galleryImages": [
            wm("2022 Toyota GR86 Premium in Track bRed, front right (NYIAS 2022).jpg", 1200),
            wm("2022 Toyota GR86 ZN8 Track Bred.jpg", 1200),
        ],
    },
    "u7": {
        "coverImage": wm("Toyota GR Supra SZ (3BA-DB82-ZSRW) front.jpg", 1600),
        "role": "Builder",
        "socialLinks": {"instagram": "supra.sean", "youtube": "seanbuildsasupra"},
        "communities": ["Supra MK5 SoCal", "Buttonwillow Regulars"],
        "featuredCarId": "c7",
        "galleryImages": [
            wm("Toyota GR Supra RZ (3BA-DB42-ZRRW) front.jpg", 1200),
            wm("The frontview of Toyota GR SUPRA SZ (3BA-DB82-ZSRW).jpg", 1200),
        ],
    },
    "u8": {
        "coverImage": wm("1997 Honda Civic Type R EK9.jpg", 1600),
        "role": "Track Enthusiast",
        "socialLinks": {"instagram": "alex.moreno"},
        "communities": ["E46 Owners SoCal", "HB Cars & Coffee"],
        "featuredCarId": "c8",
        "galleryImages": [
            wm("BMW E46-M3 (3).JPG", 1200),
            wm("Honda Civic EK4.jpg", 1200),
            wm("S54B32-BMW-E46-M3.jpg", 1200),
        ],
    },
}

users = load("users.json")
for user in users:
    fields = PROFILE_FIELDS.get(user["id"])
    if not fields:
        continue
    user.update(fields)
save("users.json", users)

print("Wired", len(cars), "cars (added c9) and", len(users), "user profiles.")
