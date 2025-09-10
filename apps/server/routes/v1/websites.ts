import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/v1/websites - Get all websites
router.get('/', (req: Request, res: Response) => {
  try {
    // Mock data - replace with your database logic
    const websites = [
      { 
        id: 1, 
        name: 'My Portfolio', 
        url: 'https://portfolio.example.com',
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z'
      },
      { 
        id: 2, 
        name: 'E-commerce Store', 
        url: 'https://store.example.com',
        status: 'active',
        createdAt: '2024-02-20T14:45:00Z'
      }
    ];
    
    res.json({
      success: true,
      data: websites,
      message: 'Websites retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving websites',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/v1/websites/:id - Get website by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock data - replace with your database logic
    const website = { 
      id: parseInt(id), 
      name: 'My Portfolio', 
      url: 'https://portfolio.example.com',
      status: 'active',
      description: 'Personal portfolio website',
      technologies: ['React', 'TypeScript', 'Node.js'],
      createdAt: '2024-01-15T10:30:00Z'
    };
    
    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found'
      });
    }

    res.json({
      success: true,
      data: website,
      message: 'Website retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving website',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/v1/websites - Create new website
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, url, description, technologies } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        success: false,
        message: 'Name and URL are required'
      });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    // Mock creation - replace with your database logic
    const newWebsite = {
      id: Date.now(), // Simple ID generation for demo
      name,
      url,
      description: description || '',
      technologies: technologies || [],
      status: 'active',
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: newWebsite,
      message: 'Website created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating website',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/v1/websites/:id - Update website
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, url, description, technologies, status } = req.body;

    // Basic URL validation if URL is provided
    if (url) {
      try {
        new URL(url);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid URL format'
        });
      }
    }

    // Mock update - replace with your database logic
    const updatedWebsite = {
      id: parseInt(id),
      name,
      url,
      description,
      technologies,
      status,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedWebsite,
      message: 'Website updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating website',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/v1/websites/:id - Delete website
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Mock deletion - replace with your database logic
    res.json({
      success: true,
      message: `Website with ID ${id} deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting website',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/v1/websites/:id/status - Check website status
router.get('/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Mock status check - replace with actual website ping logic
    const statusCheck = {
      websiteId: parseInt(id),
      status: 'online',
      responseTime: '245ms',
      statusCode: 200,
      checkedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: statusCheck,
      message: 'Website status checked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking website status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
