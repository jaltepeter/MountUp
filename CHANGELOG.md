# 3.1.0

- Converted to typescript
- Direct integration with the module token attacher
- Minor bug fix 
- Preparation to foundryvtt 0.8.0

# 3.0.1
- Fix for rider rotation not returning to zero when mount does
- Fix for rider being dismounted if being moved with mount while 'dismount while outside rider bounds' is enabled
- Fix logo not displaying properly in settings window


# 3.0.0
- NEW: Multiple riders per mount!
- New Settings options for rider lock:
    - No lock - do nothing when rider moves off mount
    - Lock to location - rider cannot move at all without mount (current version of rider lock)
    - Lock to mount bounds - rider is free to move about while inside the mount bounds, but cannot move out.
    - Dismount when outside mount bounds - if rider is moved off the mount, it will be dismounted
- Unless locked by 'rider lock', riders are free to move about their mounts and that positioning will be remmebered when the mount is moved
- HUD Buttons now have tooltips to help you better understand the effect of clicking it
- To mount:
    - Select 2 or more tokens and right click on the 'mount' token and click the mount Buttons
    - You can mount multiple riders all at once, or one at a time
- To Dismount:
    - Select a mount - clicking the dismount button will drop all riders for that mount *check tooltips*
    - Select a rider - clicking the dismount button will dismount only that rider *check tooltips*
- Use Webpack to significantly reduce module size


# 2.5.0
- New Setting: "Rider Rotation" allows for riders to match their rotation to the mount's rotation
- Moved all settings for Mount Up! into their own settings window.

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
