//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract MemeForest is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter public NumOfAllMemes;
    Counters.Counter public NumOfAllMembers;

    struct MemeMembers {
        string Name;
        address MemeberAddress;
        uint MyId;
        uint MyMemes;
        uint MyStarredMemes;
        uint MyDeletedMemes;
        string Datejoined;
    }

    mapping(uint => MemeMembers) private IdMembers;
    mapping(address => bool) private alreadyAMember;
    mapping(address => mapping(uint => bool )) private DidyouStar;
    mapping(address => mapping(uint => bool )) private DidyouLike;

    struct MemeFiles {
        string Memeinfo;
        address Owner;
        uint fileId;
        bool starred;
        uint Stars;
        uint Likes;
        string DateOfCreation;
        string FileType;
        bool IsDownloadable;
      
    }

    mapping (uint => MemeFiles) private IdMemeFiles;
    mapping(uint => address) private StarredMemeFiles;

     uint public NumberOfUploads;

    event Memberjoined (
        uint256 MemberId,
        string MemberName,
        string Datejoined,
        address MemberAddress, 
        uint256 MemberTotalMemes,
        uint256 MemberStarredMemes,
        uint256 MemberDeletedMemes,
        uint256 MemberTotalLikes
    ) ;

    event CreateMeme (
        uint256 MemeId,
        string MemeInfo,
        address MemeCreator,
        bool IsMemeStarred,
        uint256 MemeStars,
        uint256 MemeLikes,
        string DateOfCreation,
        string Filetype,
        bool IsDownloadable,
        uint Membernum,
        uint NewNumberMemberMemes
    );

    event StarredMeme (
        uint256 MemeId,
        uint256 CreatorId,
        uint256 NewStarNo,
        uint256 CreatorStarredMemes
    );

    event UnStarringMeme (
        uint256 MemeId,
        uint256 CreatorId,
        uint256 NewStarNo,
        uint256 CreatorStarredMemes
    );
    event LikingMeme (
        uint256 MemeId,
        uint256 CreatorId,
        uint256 NewLikesNo
    );
    event UnLikingMeme ( 
        uint256 MemeId,
        uint256 CreatorId,
        uint256 NewLikesNo);

    function CreateMembers (string memory _name, string memory _date) public nonReentrant{
        require(alreadyAMember[msg.sender] == false, "You are already a member");

        NumOfAllMembers.increment();
        uint currentMemberId = NumOfAllMembers.current();

        IdMembers[currentMemberId] = MemeMembers (
            _name,
            msg.sender,
            currentMemberId,
            0,
            0,
            0,
            _date

        );

        alreadyAMember[msg.sender] = true;
        
        emit Memberjoined (
            currentMemberId,
            _name,
            _date,
            msg.sender,
            0,
            0,
            0,
            0
        );
    }


    function fetchMembers() public view returns(MemeMembers[] memory) {
        uint currentMemberNum = NumOfAllMembers.current();
        uint currentIndex = 0;
        MemeMembers[] memory members = new MemeMembers[] (currentMemberNum);
        for (uint256 index = 0; index < currentMemberNum; index++) {
            uint currenNum = IdMembers[index + 1].MyId;
            MemeMembers storage memeMem = IdMembers[currenNum];
            members[currentIndex] = memeMem;
            currentIndex+=1;
        }
        return members;
    }


    function GetMemberByAddr(address _member)external view returns(MemeMembers[] memory){
        uint currentMemberNum = NumOfAllMembers.current();
        uint currentIndex = 0;
        MemeMembers[] memory foundMember = new MemeMembers[] (1);
        for(uint i = 0; i< currentMemberNum; i++){
            if(_member == IdMembers[i+1].MemeberAddress ){
                uint currentmem = IdMembers[i+1].MyId;
                MemeMembers storage memMem = IdMembers[currentmem];
                foundMember[currentIndex] = memMem;
            }
        }
        return foundMember;

    }


    function IsAMember(address sender) external view returns(bool) {
        bool member = alreadyAMember[sender];
        return member;
    }

    function CreateMemeItems( string memory memeinfo,
    address _owner, 
    string memory _date,
    string memory _filetype,
    bool _isDownloadable
    ) 
    public nonReentrant{
        NumOfAllMemes.increment();
        uint256 currentMeme =  NumOfAllMemes.current();
        IdMemeFiles[currentMeme] = MemeFiles(
            memeinfo,
            _owner,
            currentMeme,
            false,
            0,
            0,
            _date,
            _filetype,
            _isDownloadable
        );
         uint currentMemberNum = NumOfAllMembers.current();
          uint currentNum;
          uint newMemes;
        for (uint i = 0; i < currentMemberNum; i++) {
            if(_owner == IdMembers[i+1].MemeberAddress){
                currentNum = IdMembers[i+1].MyId;
                IdMembers[currentNum].MyMemes +=1;
                newMemes =  IdMembers[currentNum].MyMemes;
            }
        }

        emit CreateMeme (
            currentMeme,
            memeinfo,
            _owner,
            false,
            0,
            0,
            _date,
            _filetype,
            _isDownloadable,
            currentNum,
            newMemes
        );

    }


    function fetchAllMemes() public view returns(MemeFiles[] memory) {

        uint currentMemeNum = NumOfAllMemes.current();

        uint currentIndex = currentMemeNum;
        MemeFiles[] memory memes = new MemeFiles[] (currentMemeNum);

        for (uint256 index = 0; index < currentMemeNum; index++) {
            uint currenNum = IdMemeFiles[index +1].fileId;
            MemeFiles storage memeFiles = IdMemeFiles[currenNum];

            memes[currentIndex - 1] = memeFiles;
            currentIndex-=1;

            
        }
        return memes;
    }

    function LikeMeme(uint _id) public {
        uint currentMemeNum = NumOfAllMemes.current();
        uint currentMemberNum = NumOfAllMembers.current();
        uint currentNum;
        uint256 newLikes;
        for(uint i = 0; i < currentMemeNum; i++){
            if(_id == IdMemeFiles[i+1].fileId) {
              
                IdMemeFiles[i+1].Likes+=1;
                newLikes = IdMemeFiles[i+1].Likes;
                 DidyouLike[msg.sender][_id]= true;
                
               
            }
        }
        for (uint index = 0; index < currentMemberNum; index++) {
            if(msg.sender == IdMembers[index+1].MemeberAddress){
                currentNum = IdMembers[index+1].MyId;
    
            }
        }
    
        emit LikingMeme(
            _id,
            currentNum,
            newLikes
        );
    }
    function UnLikeMeme(uint _id) public {
        uint currentMemeNum = NumOfAllMemes.current();
        uint currentMemberNum = NumOfAllMembers.current();
        uint currentNum;
        uint256 newLikes; 
        for(uint i = 0; i < currentMemeNum; i++){
            if(_id == IdMemeFiles[i+1].fileId) {
              
                IdMemeFiles[i+1].Likes-=1;
                  DidyouLike[msg.sender][_id]= false;
                
               
            }
        }
        for (uint index = 0; index < currentMemberNum; index++) {
            if(msg.sender == IdMembers[index+1].MemeberAddress){
                currentNum = IdMembers[index+1].MyId;
    
            }
        }
    
        emit UnLikingMeme(
            _id,
            currentNum,
            newLikes
        );
    }
    
    function WhatDidILike (uint _id, address sender) public view returns (bool) {
         bool youLiked =  DidyouLike[sender][_id];
         return youLiked;
    }

    function StarMeme(uint _id ) public {
        uint currentMemeNum = NumOfAllMemes.current();
        uint currentMemberNum = NumOfAllMembers.current();
        uint currentNum;
        uint newstars;
        uint newstarredMemes;
        for(uint i = 0; i < currentMemeNum; i++){
            if(_id == IdMemeFiles[i+1].fileId) {
                IdMemeFiles[_id].starred = true;
                IdMemeFiles[_id].Stars+=1;
                newstars = IdMemeFiles[_id].Stars;
                DidyouStar[msg.sender][_id]= true;
               
                
               
            }
        }
        for (uint index = 0; index < currentMemberNum; index++) {
            if(msg.sender == IdMembers[index+1].MemeberAddress){
                currentNum = IdMembers[index+1].MyId;
                IdMembers[currentNum].MyStarredMemes +=1;
                newstarredMemes = IdMembers[currentNum].MyStarredMemes;
            }
        }
        emit StarredMeme (
        _id,
        currentNum,
        newstars, 
        newstarredMemes );
    }

    
    function RemoveStarMeme(uint _id) public {
        uint currentMemeNum = NumOfAllMemes.current();
        uint currentMemberNum = NumOfAllMembers.current();
        uint currentNum;
        uint newstars;
        uint newstarredMemes;
        for(uint i = 0; i < currentMemeNum; i++){
            if(_id == IdMemeFiles[i+1].fileId) {
                IdMemeFiles[_id].starred = true;
                IdMemeFiles[_id].Stars-=1;
                newstars = IdMemeFiles[_id].Stars;
                DidyouStar[msg.sender][_id]= false;
               
            }
        }
         for (uint index = 0; index < currentMemberNum; index++) {
            if(msg.sender == IdMembers[index+1].MemeberAddress){
                 currentNum = IdMembers[index+1].MyId;
                IdMembers[currentNum].MyStarredMemes -=1;
                newstarredMemes = IdMembers[currentNum].MyStarredMemes;
            }
        }
        emit UnStarringMeme (
            _id,
            currentNum,
            newstars,
            newstarredMemes
        );
    }

    function WhatDidIStar (uint _id, address sender) public view returns (bool) {
         bool youStarred =  DidyouStar[sender][_id];
         return youStarred;
    }

    function fetchMyStarredMemes(address sender) public view returns (MemeFiles[] memory) {
        uint currentMemberNum = NumOfAllMembers.current();
        uint currentNum;
        for (uint i = 0; i < currentMemberNum; i++) {
            if(sender == IdMembers[i+1].MemeberAddress){
                uint val = IdMembers[i+1].MyId;
                currentNum = IdMembers[val].MyStarredMemes;
            }
        }
      
        uint currentMemeNum = NumOfAllMemes.current();
        MemeFiles[] memory memes  = new MemeFiles[] (currentNum);
                
        uint currentIndex = 0;
        for (uint index = 0; index < currentMemeNum; index++) {
            uint id = IdMemeFiles[index+1].fileId;
            
            if(DidyouStar[sender][id] == true && IdMemeFiles[id].starred == true ){
                
            MemeFiles storage memeFiles = IdMemeFiles[id];
            memes[currentIndex] = memeFiles;
            currentIndex+=1;
              
            }
             
        }     
         
        return memes;
         
    }

    function fetchMyMeme(address sender) public view returns (MemeFiles[] memory) {
       
       
         uint currentMemberNum = NumOfAllMembers.current();
        uint currentNum;
        for (uint i = 0; i < currentMemberNum; i++) {
            if(sender == IdMembers[i+1].MemeberAddress){
                 uint val = IdMembers[i+1].MyId;
                currentNum = IdMembers[val].MyMemes;
                 console.log(val);
                 
            }
        }
        
    


     uint currentMemeNum = NumOfAllMemes.current();
        uint currentIndex = 0;
        MemeFiles[] memory memes = new MemeFiles[] (currentNum);
         for (uint i = 0; i < currentMemeNum; i++) {
             uint id = IdMemeFiles[i+1].fileId;
             if(sender ==  IdMemeFiles[id].Owner  ){
                 
            MemeFiles storage memeFiles = IdMemeFiles[id];
             
            memes[currentIndex] = memeFiles;
            currentIndex+=1;
             }
         }
         return memes;
    }

 
} 

