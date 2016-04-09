# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = 'box-cutter/ubuntu1404'
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 35729, host: 35729
  config.vm.provision "shell", inline: <<-SHELL
    sudo sed -i.bak -e "s%http://us.archive.ubuntu.com%http://jp.archive.ubuntu.com%g" /etc/apt/sources.list
    curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
    sudo apt-get install -y nodejs
  SHELL
end
