# 2.4.2
- Fix for error message on other players' instance when a mount is moved due to no permissinos to set flags on unowned tokens

# 2.4.1
- Fix for rider location on fresh install or upgrade

# 2.4.0
- New settings to configure where the rider should be placed on the mount:
	- Options for horizontal are "Left", "Center", and "Right"
	- Options for vertical are "Top", "Center", and "Bottom"
- Fix for rider lock warning when dismounting if rider lock is enabled


# 2.3.0
- New setting allowing for riders to be locked to their mounts until dismounted
	- If enabled, this will prevent rider tokens from moving off of their mount, but they will still move with the mount

# 2.2.0
- Players can now move tokens unowned by them if they are mounted to a token they own
- Added macro support for common operations:
	- Mounting
	- Dismounting
	- Dropping a rider from a mount
- Added 2 new settings:
	- HUD Column: Define if you want the Mount Up button to appear on the left or right column in the HUD
	- HUD Top/Bottom: Define if you want the Mount Up button to appear on the top or bottom of the column in the HUD

# 2.1.0
- Fix for FVTT 0.5.7 hotfix changes

# 2.0.1
- Ensure compatibility with 0.5.6

# 2.0
- Significant rewrite to how ride links are stored
	- No longer requires sockets or game settings
	- Should eliminate multiple issues experienced due to permission issues

# 1.2.1
- Fixes the text for the settings hints
- Fixed the error message during module init

# 1.2
- Fixed permission issues by handling ride creation on GM side via socket
- Better handling of ancestor interactions (you should now longer be able to have a rider be mounted by its own mount)

# 1.1
- Fixed dismount chat message sending mount as rider and rider as mount

# 1.0
- Initial Release!