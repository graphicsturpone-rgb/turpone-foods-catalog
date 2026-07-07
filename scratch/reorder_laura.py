import re

filepath = 'assets/js/custom-interactions.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_team_members = """            const teamMembers = [
                { id: "member2", name: "Anthony Capone", role: "Managing Director", img: "Anthony%20Capone.webp" },
                { id: "member1", name: "Joe Turturici", role: "Sales Director", img: "Joe%20Turturici.webp" },
                { id: "member6", name: "Rosemary Bruni", role: "Logistic Coordinator", img: "Rosemary%20Bruni.webp" },
                { id: "member10", name: "Sara Turturici", role: "Marketing Coordinator", img: "Sara-Turturici.webp" },
                { id: "member9", name: "Tony Capone", role: "Culinary Director", img: "Tony%20Capone.webp" },
                { id: "member11", name: "Carlos Ozuna", role: "Senior Graphic Design / AI Web Developer", img: "carlos-ozuna.webp" },
                { id: "member4", name: "Gianni Iaboni", role: "E-Commerce Specialist", img: "Gianni%20Iaboni.webp" },
                { id: "member5", name: "Maria Guarin", role: "Project Manager", img: "Maria%20Guarin.webp" },
                { id: "member7", name: "Beata Niyoyita", role: "Accounting", img: "Beata%20Niyoyita.webp" },
                { id: "member8", name: "Stephen Liu", role: "Accounting", img: "Stephen%20Liu.webp" },
                { id: "member3", name: "Laura Trentadue", role: "Lead Creative Designer", img: "Laura%20Trentadue.webp" }
            ];"""

new_team_members = """            const teamMembers = [
                { id: "member2", name: "Anthony Capone", role: "Managing Director", img: "Anthony%20Capone.webp" },
                { id: "member1", name: "Joe Turturici", role: "Sales Director", img: "Joe%20Turturici.webp" },
                { id: "member6", name: "Rosemary Bruni", role: "Logistic Coordinator", img: "Rosemary%20Bruni.webp" },
                { id: "member10", name: "Sara Turturici", role: "Marketing Coordinator", img: "Sara-Turturici.webp" },
                { id: "member9", name: "Tony Capone", role: "Culinary Director", img: "Tony%20Capone.webp" },
                { id: "member11", name: "Carlos Ozuna", role: "Senior Graphic Design / AI Web Developer", img: "carlos-ozuna.webp" },
                { id: "member4", name: "Gianni Iaboni", role: "E-Commerce Specialist", img: "Gianni%20Iaboni.webp" },
                { id: "member3", name: "Laura Trentadue", role: "Lead Creative Designer", img: "Laura%20Trentadue.webp" },
                { id: "member5", name: "Maria Guarin", role: "Project Manager", img: "Maria%20Guarin.webp" },
                { id: "member7", name: "Beata Niyoyita", role: "Accounting", img: "Beata%20Niyoyita.webp" },
                { id: "member8", name: "Stephen Liu", role: "Accounting", img: "Stephen%20Liu.webp" }
            ];"""

content = content.replace(old_team_members, new_team_members)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated JS file")
