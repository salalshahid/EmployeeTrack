import React, { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBBtn,
} from 'mdb-react-ui-kit';
import { uploadProfilePicture } from '../api/users';

const Dashboard = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(storedUser || {});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(user.profile_picture || '/images/avatar.jpg');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user.profile_picture) {
      setPreviewImage(user.profile_picture);
    }
  }, [user.profile_picture]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const response = await uploadProfilePicture(selectedFile);
      const profilePictureUrl = response.profile_picture;
      const updatedUser = { ...user, profile_picture: profilePictureUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Update user object in local storage
      setSelectedFile(null); // Clear the selected file
      setPreviewImage(profilePictureUrl); // Update the preview image
      setMessage('Profile picture uploaded successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <section className="auth-wrapper bg-image" style={{ backgroundImage: `url(./images/bg-image.jpg)` }}>
      <MDBContainer className="py-5 h-200 w-100">
        <MDBRow className="justify-content-center align-items-center h-200 w-100">
          <h3>Welcome</h3><br />
          <MDBCol lg="8" className="mb-4 mb-lg-0">
            <MDBCard className="mb-3" style={{ borderRadius: '1rem' }}>
              <MDBRow className="g-0">
                <MDBCol md="4" className="gradient-custom text-center"
                  style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                  <MDBCardImage src={previewImage}
                    alt="Avatar" className="mt-5 mb-3" style={{ width: '120px', borderRadius: '25rem' }} fluid />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-picture-input"
                    onChange={handleFileChange}
                  />
                  <MDBBtn onClick={() => document.getElementById('profile-picture-input').click()}>
                    Edit Profile Picture
                  </MDBBtn>
                  {selectedFile && (
                    <MDBBtn onClick={handleUpload} color="primary" className="mt-2">
                      Upload
                    </MDBBtn>
                  )}
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody className="p-4">
                    <MDBTypography tag="h6">User Information</MDBTypography>
                    <hr className="mt-0 mb-4" />
                    <MDBRow className="pt-1">
                      <MDBCol size="12">
                        <MDBTypography tag="h6">Full Name</MDBTypography>
                        <MDBCardText className="text-muted">{user.full_name}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow className="pt-1">
                      <MDBCol size="12">
                        <MDBTypography tag="h6">Email Address</MDBTypography>
                        <MDBCardText className="text-muted">{user.email}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow className="pt-1">
                      <MDBCol size="12">
                        <MDBTypography tag="h6">Role</MDBTypography>
                        <MDBCardText className="text-muted">{user.role.capitalize()}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    {message && (
                      <MDBRow className="pt-1">
                        <MDBCol size="12">
                          <MDBCardText className="text-muted">{message}</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    )}
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}

export default Dashboard;