# Changelog

## 0.2.1

- Commented out the collision checks that are not wall bumping; main goal is to achieve online play capabilities so player collisions will be added back only when the main goal is achieved
- Removed console.logs of functions known to work; commented out other console logs currently not needed
- Started 'init' action protocol; left halfway, Morpheus calls for me

## 0.2.0

- Removed z index and stage ordering; each sprite is now child of one of three *stage* layers appended in the wanted order
- Improved collision checks, making it even more of a mess of parentheses (still not completely functional)
- Postponed updates of a player's direction to when a turn actually starts and not 'whenever'; behold the increase in collision bugs
- Added Changelog
- Accidentaly added some *node_modules/* files; not in the mood to find out how to remove them from the repo

## 0.1.0

- Imported everything from the pongo-pandemonium prototype
- Reordered files into folders *client/* and *server/* for slight hierarchy clarity