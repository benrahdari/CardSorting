# Project Setup Instructions

This README outlines the steps necessary to set up and run the web application locally and on an AWS EC2 instance. Follow these instructions to ensure a smooth setup and execution of the study.

## Run and Test Locally

### Prerequisites
- XAMPP (or any similar local server environment like WAMP or MAMP)

### Steps
1. **Install XAMPP**: Download and install XAMPP from the [official site](https://www.apachefriends.org/index.html).
2. **Place Project Files**: Move your project files into the `htdocs` directory found in your XAMPP installation folder.
3. **Run Apache**: Open XAMPP Control Panel and start the Apache service.
4. **Access Project**: Open your browser and navigate to `http://localhost/yourprojectfoldername` to view the study page.
5. **Test and Modify**: Familiarize yourself with the project structure and how you can adapt it to your requirments. 

## Runnin a Study 

To run your own study, please follow these steps:

1. **Add your cases**: Replace the content of `cases` folder with your own materia. Please follow the same naming convention as in the example.
2. **Add your sample**: Replace the content of `sample` folder with your own materia. This is what will be shown to the user as reference.
3. **Change the study parameters**: To change the parameters such as total number of options or survey questions you can edit the `assets/func.js` directly. 
4. **Move to server**: Follow the instruction in the next section on how to run this application on a server.


## Run on Server: AWS EC2 Instance

### Launch and Connect
1. **Launch an EC2 Instance**:
    ```bash
    aws ec2 run-instances --image-id ami-0c55b159cbfafe1f0 --count 1 --instance-type t2.micro --key-name YourKeyName --security-group-ids sg-xxxxxxxx
    ```
2. **SSH into Your Instance**:
    ```bash
    ssh -i "YourKeyName.pem" ec2-user@ec2-xx-xxx-xxx-xxx.compute-1.amazonaws.com
    ```

### Server Setup and Deployment
3. **Install Apache**:
    ```bash
    sudo yum update -y
    sudo yum install -y httpd
    sudo systemctl start httpd
    sudo systemctl enable httpd
    ```
4. **Deploy Application**:
    - Use SCP or FTP to transfer files to `/var/www/html`.
    - Set the correct permissions:
    ```bash
    sudo chown -R ec2-user:ec2-user /var/www/html/yourprojectfolder
    ```
5. **Access Your Application**:
    - Find your instance's public IP.
    - Visit `http://your-public-ip/yourprojectfolder` in a web browser.

## API Access and Configuration

This system uses an external API to securely store results in the cloud. If you intend to use this for your research, please consult with the admin (Behnam) to confirm that the API is operational and ready for use.
