# Raycaster and mouse events

    A raycaster can cast a ray in aspecific direction and test what objects intersect with it.

    Usage examples :
    1. Detect if there is wall infront of the player in games.
    2. Test if a gun hits something.
    3. We can alos test if something is currently below the mouse to simulate mouse events.
    4. Detect if something is approaching some particular object.

1. Instantiate a Raycaster
   const raycaster = new THREE.Raycaster()

   // We can use the set(...) method to set the origin and direction of ray.

   const rayOrigin = new THREE.Vector3(-3, 0, 0);
   const rayDirection = new THREE.Vector3(10, 0, 0);
   rayDirection.normalize();
   rayDirection.set(rayOrigin, rayDirection);

2. Cast a ray
   To cast a ray there are two options

   1. intersectObject(...) - to test one object
   2. intersectObjects(...) - to test an array of objects

   const intersect = raycaster.intersectObject(object1)

   const intersects = raycaster.intersectObject([object1,onject2,obhect3])

   Intersect is an array. And can have multiple of objects.
   Each item contain information that is usefull for us.

   1. distance : distance between the origin of ray and the collision point.
   2. face : what face of the geometry is by the ray.
   3. faceIndex : the index of that face.
   4. object : what object is concerned by the collision.
   5. point : a Vector3 of the exact position of the collision.
   6. uv : the UV coordinates in that geometry.

3. If we want to test things while they are moving, we have to do testing on each frame.

4. We can use the raycaster to test if an object is behind the cursor. Three.js will do all the heavy lifting.
   We need the coordinates of the mouse but not in pixels. We need a value that goes from -1 to 1, in horizontal and vertical axes.

5. We should avoid casting the ray in the mousemove event callback and do it in the tick function

6. Use setFromCamera(...) method to orient the ray in the right direction.
