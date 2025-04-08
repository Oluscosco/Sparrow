const API_BASE_URL = 'https://sheets.googleapis.com/v4';
const DRIVE_BASE_URL = 'https://www.googleapis.com/drive/v3';

interface SheetDetails {
  id: string;
  name: string;
  webViewLink: string;
  createdTime?: string;
  modifiedTime?: string;
}

export const createNewSheet = async (accessToken: string, title: string) => {
  try {
    console.log('Creating sheet with title:', title);
    console.log('Using access token:', accessToken ? 'present' : 'missing');
    
    const response = await fetch(`${API_BASE_URL}/spreadsheets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: title,
        },
        sheets: [
          {
            properties: {
              title: 'Sheet1',
              gridProperties: {
                rowCount: 1000,
                columnCount: 26,
              },
            },
          },
        ],
      }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response text:', text);
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch (e) {
        errorData = { error: { message: text } };
      }
      throw new Error(errorData.error?.message || `Failed to create sheet: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Created sheet:', data);
    return data;
  } catch (error) {
    console.error('Error creating sheet:', error);
    throw error;
  }
};

export const getSheetsList = async (accessToken: string) => {
  try {
    console.log('Fetching sheets list');
    console.log('Using access token:', accessToken ? 'present' : 'missing');
    
    const response = await fetch(
      `${DRIVE_BASE_URL}/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name,webViewLink)`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response text:', text);
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch (e) {
        errorData = { error: { message: text } };
      }
      throw new Error(errorData.error?.message || `Failed to fetch sheets: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched sheets:', data.files);
    return data.files;
  } catch (error) {
    console.error('Error fetching sheets:', error);
    throw error;
  }
};

export const deleteSheet = async (accessToken: string, fileId: string) => {
  try {
    console.log('Deleting sheet with ID:', fileId);
    console.log('Using access token:', accessToken ? 'present' : 'missing');
    
    const response = await fetch(`${DRIVE_BASE_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response text:', text);
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch (e) {
        errorData = { error: { message: text } };
      }
      throw new Error(errorData.error?.message || `Failed to delete sheet: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting sheet:', error);
    throw error;
  }
};

export const getSheetDetails = async (accessToken: string, sheetId: string): Promise<SheetDetails> => {
  try {
    const response = await fetch(`${API_BASE_URL}/spreadsheets/${sheetId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(`Failed to fetch sheet details: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.spreadsheetId,
      name: data.properties.title,
      webViewLink: data.spreadsheetUrl,
      createdTime: data.createdTime,
      modifiedTime: data.modifiedTime,
    };
  } catch (error) {
    console.error('Error fetching sheet details:', error);
    throw error;
  }
};

export const updateSheetTitle = async (accessToken: string, sheetId: string, newTitle: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/spreadsheets/${sheetId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: newTitle,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(`Failed to update sheet title: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating sheet title:', error);
    throw error;
  }
}; 