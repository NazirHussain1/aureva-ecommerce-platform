import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft, FiArrowRight, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdCheckCircle } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = use