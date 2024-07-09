import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/layout";
import CTA from "@/components/CTA";
import FeaturedProjects from "@/components/FeaturedProjects";
const inter = Inter({ subsets: ["latin"] });
import ProjectDetailsPage from "@/components/projects/SingleProject";
import { AiFillHome, AiOutlineClockCircle, AiOutlineInbox, AiOutlineUser } from "react-icons/ai"
import { MdOutlineAddComment, MdOutlineLocationOn, MdOutlineLockClock, MdVerified } from "react-icons/md";
import { RiContactsBook3Line, RiMoneyDollarCircleLine, RiShareBoxLine, RiSkull2Line, RiTeamLine } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
import { toast } from 'react-toastify';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { collection, doc, getDoc, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BsGift } from "react-icons/bs";

export default function Projectid() {
  const router = useRouter();
  const { projectId } = router.query; // Extract projectId from URL parameters
  const [project, setProject] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');
  const [totalDonations, setTotalDonations] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserData(userData);
        //  console.log("User data", userData)
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (projectDoc.exists()) {
          setProject({ id: projectDoc.id, ...projectDoc.data() });
        } else {
          toast.error('Project not found');
        }
      } catch (error) {
        toast.error('Error fetching project details:', error);
      }
    };

    const fetchDonations = async () => {
      try {
        const donationsQuery = query(collection(db, 'donations'), where('projectId', '==', projectId));
        const donationsSnapshot = await getDocs(donationsQuery);

        let total = 0;
        let count = 0;

        donationsSnapshot.forEach(doc => {
          total += doc.data().amount;
          count += 1;
        });

        setTotalDonations(total);
        setDonationCount(count);
      } catch (error) {
        console.error('Error fetching donations:', error);
      }
    };

    if (projectId) {
      fetchProjectDetails();
      fetchDonations();
    }
  }, [projectId]);
  
/*
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (projectDoc.exists()) {
          setProject({ id: projectDoc.id, ...projectDoc.data() });
        } else {
          console.error('Project not found');
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };*/}