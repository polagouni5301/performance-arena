const fs = require('fs');
const path = require('path');

class UploadController {
  /**
   * POST /api/admin/upload
   * Handles file upload using raw body parsing
   * Note: For production, consider using multer package
   */
  async uploadDataFile(req, res) {
    try {
      // Get the file from multipart form data
      // This is a simplified handler - in production use multer
      const contentType = req.headers['content-type'] || '';
      
      if (!contentType.includes('multipart/form-data')) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_CONTENT_TYPE', message: 'Content-Type must be multipart/form-data' }
        });
      }

      const folder = req.query.folder || 'processed';
      const chunks = [];
      
      // Collect request body chunks
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      
      const buffer = Buffer.concat(chunks);
      const boundary = contentType.split('boundary=')[1];
      
      if (!boundary) {
        return res.status(400).json({
          success: false,
          error: { code: 'NO_BOUNDARY', message: 'No boundary found in multipart data' }
        });
      }

      // Parse multipart data (simplified)
      const bufferString = buffer.toString('latin1');
      const parts = bufferString.split('--' + boundary);
      
      let filename = null;
      let fileData = null;
      
      for (const part of parts) {
        if (part.includes('filename="')) {
          // Extract filename
          const filenameMatch = part.match(/filename="([^"]+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
          
          // Extract file content (after double CRLF)
          const headerEnd = part.indexOf('\r\n\r\n');
          if (headerEnd !== -1) {
            // Get the raw bytes from original buffer
            const partStart = buffer.indexOf(part.substring(0, 50), 0, 'latin1');
            if (partStart !== -1) {
              const contentStart = partStart + headerEnd + 4;
              const contentEnd = buffer.indexOf(Buffer.from('\r\n--' + boundary, 'latin1'), contentStart);
              fileData = buffer.slice(contentStart, contentEnd !== -1 ? contentEnd : buffer.length - 2);
            }
          }
        }
      }

      if (!filename || !fileData) {
        return res.status(400).json({
          success: false,
          error: { code: 'NO_FILE', message: 'No file found in request' }
        });
      }

      // Validate file extension
      const ext = path.extname(filename).toLowerCase();
      const allowedExtensions = ['.xlsx', '.xls', '.csv'];
      
      if (!allowedExtensions.includes(ext)) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_TYPE', message: 'Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed.' }
        });
      }

      // Create directories if they don't exist
      const processedDir = path.join(__dirname, '../data/processed');
      const rawDir = path.join(__dirname, '../data/raw');
      
      if (!fs.existsSync(processedDir)) {
        fs.mkdirSync(processedDir, { recursive: true });
      }
      if (!fs.existsSync(rawDir)) {
        fs.mkdirSync(rawDir, { recursive: true });
      }

      // Save to target folder
      const targetPath = path.join(__dirname, `../data/${folder}`, filename);
      fs.writeFileSync(targetPath, fileData);

      // Also copy to raw folder for backup
      const rawPath = path.join(rawDir, filename);
      fs.writeFileSync(rawPath, fileData);

      res.json({
        success: true,
        message: 'File uploaded successfully',
        folder: folder,
        file: {
          name: filename,
          size: fileData.length,
          path: targetPath,
          rawPath: rawPath,
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'UPLOAD_ERROR', message: error.message }
      });
    }
  }

  /**
   * GET /api/admin/uploads
   * List all uploaded data files
   */
  async getUploadedFiles(req, res) {
    try {
      const processedDir = path.join(__dirname, '../data/processed');
      const rawDir = path.join(__dirname, '../data/raw');
      
      const getFiles = (dir, folderName) => {
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir)
          .filter(file => file.match(/\.(xlsx|xls|csv)$/i))
          .map(file => {
            const stats = fs.statSync(path.join(dir, file));
            return {
              name: file,
              folder: folderName,
              size: stats.size,
              modified: stats.mtime.toISOString(),
            };
          });
      };
      
      const files = [
        ...getFiles(processedDir, 'processed'),
        ...getFiles(rawDir, 'raw'),
      ];
      
      res.json({ success: true, files });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'LIST_ERROR', message: error.message }
      });
    }
  }

  /**
   * DELETE /api/admin/uploads/:filename
   * Delete an uploaded file
   */
  async deleteFile(req, res) {
    try {
      const { filename } = req.params;
      const folder = req.query.folder || 'processed';
      const filePath = path.join(__dirname, `../data/${folder}`, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'File not found' }
        });
      }
      
      fs.unlinkSync(filePath);
      
      res.json({ success: true, deleted: filename });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'DELETE_ERROR', message: error.message }
      });
    }
  }
}

module.exports = new UploadController();
