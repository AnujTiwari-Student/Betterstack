import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/v1/users - Get all users
router.get('/', (req: Request, res: Response) => {
  try {
    // Mock data - replace with your database logic
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    
    res.json({
      success: true,
      data: users,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/v1/users/:id - Get user by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock data - replace with your database logic
    const user = { id: parseInt(id), name: 'John Doe', email: 'john@example.com' };
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/v1/users - Create new user
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Mock creation - replace with your database logic
    const newUser = {
      id: Date.now(), // Simple ID generation for demo
      name,
      email,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/v1/users/:id - Update user
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Mock update - replace with your database logic
    const updatedUser = {
      id: parseInt(id),
      name,
      email,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/v1/users/:id - Delete user
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Mock deletion - replace with your database logic
    res.json({
      success: true,
      message: `User with ID ${id} deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
